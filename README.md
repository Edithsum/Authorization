
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




## Step 2: Challenge Part 2

### Explanation of the Requirement

The requirement states: “This delete user functionality can be done after authentication.” Based on my understanding of authentication and authorization, this requirement has both merits and drawbacks.

#### Is It a Good or Bad Idea?

**Good Idea:**
- **Authentication-Only Requirement:** Ensuring that a user is authenticated before allowing any actions, such as deleting another user, is the basic security measure. It confirms that the user attempting the action is a legitimate user of the system.
- **Simplified Access:** For scenarios where the system is designed with an assumption that all authenticated users have equal rights (e.g., in a system without role differentiation), allowing actions like deletion post-authentication might suffice.

**Bad Idea:**
- **Lack of Authorization Check:** The primary concern with this approach is that it lacks an authorization check. Authentication verifies the identity of the user, but it does not verify whether the user has the right to perform a specific action. Allowing deletion solely after authentication can lead to security vulnerabilities, such as unauthorized users deleting other accounts.
- **Risk of Abuse:** If all authenticated users are allowed to delete accounts, it could lead to potential misuse or accidental deletion of accounts by unauthorized users.

### Difference Between Authentication and Authorization

**Authentication** is the process of verifying who a user is. It confirms the identity of the user by checking credentials like a username and password.

**Authorization**, on the other hand, is the process of verifying what an authenticated user is allowed to do. It determines the permissions and access levels the user has within the system.

**Summary:** While authentication is crucial for ensuring that a user is who they claim to be, authorization is equally important to ensure that the user has the correct permissions to perform specific actions. Therefore, relying solely on authentication for actions like deleting users is not recommended without incorporating proper authorization mechanisms.

### Diagram

![Authentication and Authorization Process](./image.png)

