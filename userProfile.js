// controllers/authController.js

async function delete_user_by_username(req, res) {
    try {
        const { username } = req.body;
        const deletedUser = await UserModel.destroy({
            where: {
                username: username
            }
        });
        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
}

// routes/authHandling.js

router.post(
    "/delete/user",
    authentication,
    authorisation({ isAdmin: false }),
    (req, res) => authController.delete_user_by_username(req, res)
);

// js/userProfile.js (or you can create a new file if preferred)

document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("other-username").value;
    const response = await fetch(`http://localhost:4001/auth/delete/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
    } else {
        alert(result.message || "Failed to delete user");
    }
});
