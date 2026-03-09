const loginController = (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "Login i hasło są wymagane" });
    }

    res.json({
      message: `Witaj ${login}! Logowanie udane.`,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
};
export default loginController;
