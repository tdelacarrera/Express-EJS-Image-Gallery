import { pool } from '../db.js'
import bcryptjs from 'bcryptjs'
import jsonWebToken from "jsonwebtoken";

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.render('admin/users', {
      users: rows,
      title: 'Listado de Usuarios'
    });

  } catch (error) {
    return res.status(500).render('auth/login', { error: "Error en el servidor" })
  }
}

const createUser = async (req, res) => {
  try {
    const { username, email, password, password_confirmation, role } = req.body;

    //validar campos vacios
    if (!username || !email || !password || !password_confirmation || !role) {
      return res.status(400).json({ message: 'Hay campos incompletos' })
    }
    //validar confirmar contraseña
    if (password != password_confirmation) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" })
    }
    //validar que el correo electronico sea unico
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "El correo electrónico ya esta registrado" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt)

    await pool.query('INSERT INTO users (username, email, password, role) VALUES(?,?,?,?)', [username, email, hashPassword, role]);

    res.redirect(req.headers.referer);

  } catch (error) {
    return res.status(500).render('admin/users', { error: "Error en el servidor" })
  }
}

const registerUser = async (req, res) => {
  try {
    const { username, email, password, password_confirmation } = req.body;

    //validar campos vacios
    if (!username || !email || !password || !password_confirmation) {
      return res.status(400).render('auth/register', { error: 'Hay campos incompletos' })
    }
    //validar confirmar contraseña
    if (password != password_confirmation) {
      return res.status(400).render('auth/register', { error: "Las contraseñas no coinciden" })
    }
    //validar que el correo electronico sea unico
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).render('auth/register', { error: "El correo electrónico ya esta registrado" })
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt)

    await pool.query('INSERT INTO users (username, email, password) VALUES(?,?,?)', [username, email, hashPassword]);
    res.redirect('/images');

  } catch (error) {
    return res.status(500).render('auth/register', { error: "Error en el servidor" })
  }
}

const updateUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    //validar campos vacios
    if (!username || !email || !password|| !role) {
      return res.status(400).json({ message: 'Hay campos incompletos' })
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt)

    await pool.query('UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE user_Id = ?', [username, email, hashPassword, role, req.body.id]);
    res.redirect(req.headers.referer);
  } catch (error) {
    return res.status(500).render('auth/login', { error: "Error en el servidor" })
  }

}

const removeUser = async (req, res) => {
  await pool.query('DELETE FROM users WHERE user_id = ?', [req.body.id]);
  res.redirect(req.headers.referer);
}

const login = async (req, res) => {
  try {
    //validar campos vacios
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render('auth/login', { error: "Hay campos incompletos" })
    }
    //obtener usuario
    const [rows] = await pool.query('SELECT username, email, role, password FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(400).render('auth/login', { error: "Usuario o contraseña invalida" })
    }

    const user = rows[0];

    //comprobar hash
    const isValid = await bcryptjs.compare(password, user.password)
    if (isValid) {
      const token = jsonWebToken.sign({
         username: user.username,
         email: user.email ,
         role: user.role
        }, 
        process.env.JWT_SECRET, { expiresIn: '1h' });
      const cookieOption = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        path: "/"
      }
      res.cookie("jwt", token, cookieOption);
      return res.status(200).redirect('/images')
    } else {
      return res.status(401).render('auth/login', { error: "Usuario o contraseña invalida" })
    }

  } catch (error) {
    return res.status(500).render('auth/login', { error: "Error en el servidor" })
  }
}

const logout = async (req, res) =>{
  res.clearCookie('jwt');
  res.redirect('/users/login');
}

const getLoginForm = async (req, res) => {
  res.render('auth/login', {
    title: 'Inicio de sesión'
  });
}

const getRegisterForm = async (req, res) => {
  res.render('auth/register', {
    title: 'Registro de usuario'
  });
}


export const methods = {
  getUsers,
  login,
  logout,
  createUser,
  registerUser,
  updateUser,
  removeUser,
  getLoginForm,
  getRegisterForm
}