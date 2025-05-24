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

  res.render('gallery/images', {
    images: rows,
    title: 'Galería de Imágenes',
    currentPage: page,
    totalPages: totalPages,
    tags: tags
  });
};

const getImageForm = async (req, res) => {
  res.render('gallery/upload', {
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

  res.render('gallery/images', {
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
  await pool.query('DELETE FROM images WHERE user_id = ?', [req.body.id])
  res.redirect(req.headers.referer);
}


export const methods = {
  getImages,
  getImageForm,
  searchImage,
  createImage,
  updateImage,
  removeImage
}