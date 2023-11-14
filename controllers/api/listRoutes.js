const router = require("express").Router();
const { List } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.status(200).json({ tasks: [] });
    }

    const listData = await List.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    res.status(200).json({ tasks: listData });
  } catch (err) {
    res.status(500).json({ message: "SadFace, listData not found", tasks: [] });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listData = await List.findByPk(req.params.id);

    if (!listData) {
      res.status(404).json({ message: "No list found with this id" });
      return;
    }

    res.status(200).json(listData);
  } catch (err) {
    res.status(500).json({ message: "Unable to find list" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const listData = await List.findAll({
      where: { user_id: req.params.id },
    });

    if (!listData) {
      res.status(404).json({ message: "OH NO! No list found with this id" });
      return;
    }

    res.status(200).json(listData);
  } catch (err) {
    res.status(500).json({ message: "sadFace, unable to find list" });
  }
});

router.post("/", withAuth, async (req, res) => {
  try {
    const newList = await List.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newList);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const listData = await List.update(
      {
        list_name: req.body.list_name,
        list_body: req.body.list_body,
        user_id: req.body.user_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!listData) {
      res.status(404).json({ message: "No list found with this id!" });
      return;
    }
    res.status(200).json({ message: "happyFace, list updated!!!" });
  } catch (err) {
    res.status(500).json({ message: "SadFace, unable to update list" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await List.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    return res.status(204).end(); // Successful deletion, no content response
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// router.delete('/:id', async (req, res) => {
//   const listId = req.params.id;

//   try {
//     // Find the list by ID
//     const list = await List.findByPk(listId);

//     if (!list) {
//       return res.status(404).json({ error: 'List not found' });
//     }

//     // Delete the list
//     await list.destroy();

//     return res.status(204).end(); // Successfully deleted, no content response
//   } catch (error) {
//     console.error('Error deleting list:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = router;
