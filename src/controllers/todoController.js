import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    // Busca los todos del usuario autenticado
    const todos = await Todo.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Devuelve los todos encontrados
    return res.status(200).json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err); // Imprime el error en la consola
    return res
      .status(500)
      .json({ message: "Server error, unable to fetch todos" });
  }
};

export const createTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  try {
    const newTodo = new Todo({
      title,
      description,
      userId: req.user.id,
    });

    console.log(newTodo);

    const savedTodo = await newTodo.save();

    return res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    return res
      .status(500)
      .json({ message: "Server error, unable to create todo" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Actualizar el to-do por id
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // Para devolver el documento actualizado
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating todo" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params; // Obtén el ID de la tarea de los parámetros de la URL

  try {
    const todo = await Todo.findByIdAndDelete(id); // Encuentra y elimina la tarea por su ID

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
