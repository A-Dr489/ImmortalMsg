import App from "./components/App.jsx";
import Authentication from "./components/Authentication.jsx";
import Messages from "./components/Messages.jsx";
import Contact from "./components/Contact.jsx";
import ContactsNav from "./components/ContactsNav.jsx";
import Pending from "./components/Pending.jsx";
import AddFriend from "./components/AddFriend.jsx";
import Profile from "./components/Profile/Profile.jsx";
import MyAccount from "./components/Profile/MyAccount.jsx";
import OAuthCallback from "./components/OAuthCallback.jsx";

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: "messages",
                element: <Messages /> 
            },
            {
                path: "/contacts",
                element: <ContactsNav />,
                children: [
                    {
                        index: "friends",
                        element: <Contact />
                    },
                    {
                        path: "pending",
                        element: <Pending />
                    },
                    {
                        path: "add",
                        element: <AddFriend />
                    }
                ]
            }, 
            {
                path: "/profile",
                element: <Profile />,
                children: [
                    {
                        index: "me",
                        element: <MyAccount />
                    }
                ]
            }

        ]
    }, 
    {
        path: '/auth',
        element: <Authentication />
    }, 
    {
        path: '/auth/callback',
        element: <OAuthCallback />
    }
];

export default routes;