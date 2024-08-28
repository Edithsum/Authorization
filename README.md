
# User Deletion Functionality

This document provides a combined script that integrates backend and frontend logic for implementing a user deletion functionality in a web application. The functionality allows authenticated users to delete other users by their username.

## Backend Code

### `authController.js`

This file contains the logic for deleting a user based on their username.

```javascript
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
```

### `authHandling.js`

This file handles the routing for the user deletion functionality, ensuring that only authenticated users can perform the deletion.

```javascript
// routes/authHandling.js

router.post(
    "/delete/user",
    authentication,
    authorisation({ isAdmin: false }),
    (req, res) => authController.delete_user_by_username(req, res)
);
```

## Frontend Code

### `userProfile.js`

This file (or a new file) contains the frontend logic for submitting the username of the user to be deleted. It listens for a form submission, sends the username to the backend, and handles the response.

```javascript
// js/userProfile.js (or create a new file if preferred)

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
