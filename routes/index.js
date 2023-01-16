const { Router } = require("express");
const axios = require("axios");
const Themes = require("../models/Themes");
const router = Router();
const cloudinary = require("../config/cloudinary");

const errorNoID = (id, res) => {
  if (!id) {
    return res
      .status(400)
      .json({ message: "Debes mandar un id de tema", error: true });
  }
};

router.post("/api/create-theme", async (req, res, next) => {
  try {
    const { title, client, logo, colors, status, primaryColor } = req.body;
    const image = await cloudinary.uploader.upload(logo, {
      folder: "hipoo",
    });
    await Themes.create({
      title,
      client,
      colors,
      logo: image.secure_url,
      status,
      primaryColor,
    });
    return res
      .status(200)
      .json({ message: "Tema creado exitosamente", error: false });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el tema", error: true });
  }
});

router.put("/api/edit-theme", async (req, res, next) => {
  try {
    errorNoID(req.body.id, res);
    let image = await Themes.findById(req.body.id);
    if (req.body.logo) {
      image = await cloudinary.uploader.upload(req.body.logo,{
        folder: "hipoo",
      });
      await Themes.findByIdAndUpdate(req.body.id,{ ...req.body, logo: image.secure_url });
    }

    const response = await Themes.findByIdAndUpdate(req.body.id, { ...req.body });
    return res
      .status(200)
      .json({ message: "Tema editado exitosamente", error: false, data: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al editar el tema", error: true });
  }
});

router.delete("/api/delete-theme", async (req, res, next) => {
  try {
    errorNoID(req.body.id, res);
    await Themes.findByIdAndDelete(req.body.id);
    return res
      .status(200)
      .json({ message: "Tema borrado exitosamente", error: false });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al borrar el tema", error: true });
  }
});


router.get("/api/themes", async (req, res, next) => {
    try {
      const themes = await Themes.find()
      return res
        .status(200)
        .json({ message: "Todos los temas", data: themes, error: false });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al encontrar los temas", error: true });
    }
  });

  router.get("/api/theme", async (req, res, next) => {
    try {
      const theme = await Themes.findById(req.body.id)
      return res
        .status(200)
        .json({ message: "Tema unico", data: theme, error: false });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al encontrar el tema", error: true });
    }
  });

module.exports = router;
