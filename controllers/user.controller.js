import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email } = req.body;

    const userSameEmail = await User.findOne({ email });
    if (userSameEmail) {
      return res.status(409).json({
        message: "Another user is using the provided email address",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });

    // Verificar si se está cargando una imagen de avatar y guardarla en Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.avatar = result.secure_url;
    }

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const paramUser = await User.findById(id);
    if (!paramUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userSameEmail = await User.findOne({ email: req.body.email });
    if (userSameEmail && paramUser.id !== userSameEmail.id) {
      return res.status(409).json({
        message: "Another user is using the provided email address",
      });
    }

    // Verificar si se está cargando una nueva imagen de avatar y actualizarla en Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      paramUser.avatar = result.secure_url;
    }

    // Actualizar otros campos del usuario según sea necesario
    // ...

    await paramUser.save();

    const { password: _, ...userWithoutPassword } = paramUser._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   // Verificar si el usuario tiene un avatar y extraer el ID público de la URL del avatar
   if (user.avatar) {
    const avatarUrlParts = user.avatar.split('/'); // Dividir la URL en partes
    const publicId = avatarUrlParts[avatarUrlParts.length - 1].split('.')[0]; // Extraer el último segmento y eliminar la extensión
    // Ahora 'publicId' contiene el ID público de la imagen en Cloudinary
    await cloudinary.uploader.destroy(publicId); // Eliminar la imagen de Cloudinary
  }

    const userDeleted = await User.findByIdAndDelete(req.params.id);

    res.status(200).json(userDeleted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };