import { React, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const MessageInput = ({ messageList, setMessageList }) => {
    const [message, setMessage] = useState("");

    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const messages = await axios.get(
                        "http://localhost:3000/add",
                        {
                            params: { message: message },
                        }
                    );
                    setMessageList([...messageList, message]);
                    setMessage("");
                }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </form>
        </div>
    );
};

const MessageList = ({ messageList }) => {
    return (
        <ul>
            {messageList.map((message) => (
                <li>{message}</li>
            ))}
        </ul>
    );
};

const App = () => {
    const [messageList, setMessageList] = useState(["Loading..."]);
    useEffect(async () => {
        const response = await axios.get("http://localhost:3000");
        setMessageList(response.data);
    }, []);

    return (
        <div>
            <h1>React Example</h1>
            <MessageInput
                messageList={messageList}
                setMessageList={setMessageList}
            />
            <MessageList messageList={messageList} />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
