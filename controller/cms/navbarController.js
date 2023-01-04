const NavLinks = require("../../models/cms/Navbar/NavbarItems");
const Activity = require("../../models/cms/Navbar/NavbarItems");
const NavLogo = require("../../models/cms/Navbar/NavbarLogo");
const ObjectId = require("mongoose").Types.ObjectId;
const addNavBarLinks = async (req, res) => {
  const navLinks = new NavLinks(req.body);
  try {
    const saveLogo = await navLinks.save();
    res.status(200).send({ status: 200, data: saveLogo });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};

const addNavBarLogo = async (req, res) => {
  const navLogo = new NavLogo(req.body);
  try {
    const saveLogo = await navLogo.save();
    res.status(200).send({ status: 200, data: saveLogo });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};

const updateNavLink = async (req, res) => {
  try {
    const updateNavLink = await NavLinks.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateNavLink });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update navLink", message: err });
  }
};

const updateNavLogo = async (req, res) => {
  try {
    const updateNavLogo = await NavLogo.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateNavLogo });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update navLogo", message: err });
  }
};

const deleteNavLink = async (req, res) => {
  try {
    await NavLinks.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 200,
      message: "navlink has been deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "delete navlink", message: err });
  }
};
const deleteNavLogo = async (req, res) => {
  try {
    await NavLogo.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 200,
      message: "navlogo has been deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "delete navlogo", message: err });
  }
};
const getAllNavLinks = async (req, res) => {
  try {
    //   if(req.query.params?params['events'])
    const navLinkList = await NavLinks.find(req.query).lean();

    res.status(200).send({ status: 200, data: navLinkList });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "get navlinks", message: err });
  }
};
const getAllNavLogo = async (req, res) => {
  try {
    //   if(req.query.params?params['events'])
    const navLinkLogo = await NavLogo.find(req.query).lean();

    res.status(200).send({ status: 200, data: navLinkLogo });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "get navLogo", message: err });
  }
};

module.exports = {
  addNavBarLinks,
  addNavBarLogo,
  updateNavLink,
  updateNavLogo,
  getAllNavLinks,
  getAllNavLogo,
  deleteNavLink,
  deleteNavLogo,
};
