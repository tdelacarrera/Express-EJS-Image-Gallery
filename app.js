import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import 'jsonwebtoken';
import { methods as  authorization } from './middlewares/authorization.js'
import { PORT } from './config.js'
import { sequelize } from './db.js';
import './models/user.model.js'; 
import './models/image.model.js'; 

//routes
import imagesRoutes from './routes/images.routes.js';
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('port', PORT);
app.listen(app.get('port'), () => {
  console.log("Server initialized on port", app.get('port'));
});

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cookieParser());
app.use(authorization.verifyToken);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use(express.json());
app.use(imagesRoutes);
app.use(userRoutes);
app.get("/", (req,res) => res.render("images/images"));


sequelize.sync({ force: true })
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });

