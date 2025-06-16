import { pool } from '../db.js'

const getImages = async (req, res) => {
  const imagesPerPage = 9;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * imagesPerPage;
  const tag = req.query.tag;

  let rows, totalImages;

  if (tag) {

    const likeTag = `%${tag}%`;
    [rows] = await pool.query(
      'SELECT * FROM images WHERE tags LIKE ? LIMIT ? OFFSET ?',
      [likeTag, imagesPerPage, offset]
    );

    [totalImages] = await pool.query(
      'SELECT COUNT(*) as count FROM images WHERE tags LIKE ?',
      [likeTag]
    );
  } else {

    [rows] = await pool.query(
      'SELECT * FROM images LIMIT ? OFFSET ?',
      [imagesPerPage, offset]
    );

    [totalImages] = await pool.query(
      'SELECT COUNT(*) as count FROM images'
    );
  }

  const totalPages = Math.ceil(totalImages[0].count / imagesPerPage);
  const tagsString = rows.map(row => row.tags).join(',');
  const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  const tags = [...new Set(tagsArray)];

  res.render('images/images', {
    images: rows,
    title: 'Galería de Imágenes',
    currentPage: page,
    totalPages: totalPages,
    tags: tags
  });
};

const getImageForm = async (req, res) => {
  res.render('images/upload', {
    title: 'Formulario de imagenes'
  });
}


const searchImage = async (req, res) => {

  const imagesPerPage = 9;
  const page = parseInt(req.query.page) || 1;
  const tag = req.query.tag
  const offset = (page - 1) * imagesPerPage;
  const [rows] = await pool.query('SELECT * FROM images WHERE tags LIKE ? LIMIT ? OFFSET ?', [tag, imagesPerPage, offset])
  const [totalImages] = await pool.query('SELECT COUNT(*) as count FROM images');
  const totalPages = Math.ceil(totalImages[0].count / imagesPerPage);
  const tagsString = rows.map(row => row.tags).join(',');
  const tagsArray = tagsString.split(',');
  const tags = [...new Set(tagsArray)];

  res.render('images/images', {
    images: rows,
    title: 'Galería de Imágenes',
    currentPage: page,
    totalPages: totalPages,
    tags: tags
  });
}

const createImage = async (req, res) => {
  const { tags } = req.body
  const path = req.file.filename;
  await pool.query('INSERT INTO images (path, tags) VALUES(?,?)', [path, tags])
  res.redirect(req.headers.referer);
}

const updateImage = async (req, res) => {
  res.redirect(req.headers.referer);
}

const removeImage = async (req, res) => {
  await pool.query('DELETE FROM images WHERE id = ?', [req.body.id])
  res.redirect(req.headers.referer);
}

const getImagesDetail = async (req, res) => {
  try {
    const id = req.params.id
    const [rows] = await pool.query('SELECT * FROM images where id = ? ', [id])
    const image = rows[0];

    res.render('images/image-detail', {
      title: 'Detalles de imagen',
      image: image
    });
  } catch (error) {
    return res.status(500).render('auth/login', { error: "Error en el servidor" })
  }


}


export const methods = {
  getImages,
  getImageForm,
  searchImage,
  createImage,
  updateImage,
  removeImage,
  getImagesDetail
}