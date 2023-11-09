const router = require("express").Router();
const { User, List } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  const userData = await User.findAll({
    include: [{ model: List }],
  });
  const users = userData.map((user) => user.get({ plain: true }));

  const listData = await List.findAll();

  const lists = listData.map((list) => list.get({ plain: true }));

  res.render("login", {
    users,
    lists,
  });
});

router.get("/profile", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.session.user_id },
      include: [{ model: List }],
    });
    const user = userData.get({ plain: true });

    res.render("profile", { user, logged_in: req.session.logged_in });
  } catch (err) {}
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/feedpage", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/login");
    return;
  }

  res.render("feedpage");
});

router.get("/list/:id", async (req, res) => {
  try {
    const projectData = await User.findByPk(req.params.id, {
      include: [
        {
          model: List,
          attributes: ["list_name"],
        },
      ],
    });

    const list = userData.get({ plain: true });

    res.render("list", {
      ...list,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
