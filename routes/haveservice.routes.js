const express = require("express");
const router = express.Router();

const Service = require("../models/haveservice.model");

//----MULTER til upload filer/img---------------
//----------------------------------------------
const multer = require('multer')
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null,'public/img')
    },
    filename: function(req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname)
    }
})
})

//----GET---------------------------------------
//----------------------------------------------
router.get("/", async (req, res) => {
  console.log("service GET", req.body);
  try {
    let service = await Service.find();

    res.status(200).json(service); /* {records:service} */
  } catch (error) {
    return res
      .status(400)
      .json({ message: "der er sket en fejl:" + error.message });
  }
});
//----GET udvalgt---------------
//----------------------------------------------

router.get("/:id", async (req, res) => {
  console.log("service GET by ID", req.body);
  try {
    let service = await Service.findById(req.params.id);

    res.status(200).json(service); /* {records:service} */
  } catch (error) {
    return res
      .status(400)
      .json({ message: "der er sket en fejl:" + error.message });
  }
});

//----post---------------
//----------------------------------------------
router.post("/", upload.single("servicePic"), async (req, res) => {
  console.log("service POST", req.body);
  try {
    let service = new Service(req.body); //gør en ny service klar med data fra requests body
    service.servicePic = req.file.filename // tilføjer img filename til den nye service
    await service.save(); // gem service i DB

    res.status(201).json({ message: "ny service er oprettet", created: service });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "der er sket en fejl i post:" + error.message });
  }
});

//----PUT---------------
//----------------------------------------------
router.put("/:id",upload.single("servicePic"), async (req, res) => {
  console.log("Service PUT", req.body);
  try {

    //hvis der kommer en fil med i requestt = billedet skal rettes (ellers skal det ikke)
    if(req.file) {
      req.body.profilepic = req.file.filename
    }

    let service = await Service.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    if (service === null) {
      return res.status(404).json({message:"ID kunne ikke findes"})
    }
    
    res.status(201).json({ ilsen: "ny Service er rettet", updated: service });
  } catch (error) {
    return res
    .status(400)
    .json({ message: "der er sket en fejl:" + error.message });
  }
});

//----DELETE---------------
//----------------------------------------------
router.delete("/:id", async (req, res) => {
  console.log("Service DELETE by ID", req.body);
  try {
    let service = await Service.findByIdAndRemove(req.params.id);
    if (service === null) {
      return res.status(404).json({message:"ID kunne ikke findes"})
    }

    res.status(200).json(service /* {records:Service} */);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "der er sket en fejl:" + error.message });
  }
});

//* husk  */
module.exports = router;
