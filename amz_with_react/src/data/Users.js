
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Axios from "axios";

// export let users=JSON.parse(localStorage.getItem('users'))||
//                 [
//                     {
//                         id: 1,
//                         userName: "John",
//                         email: "abc@gmail",
//                         address:"123 abc",
//                         password: "1234"
//                     }
//                 ];

export const useUsers = (initialVal = [],setUserId) => {
    const [users, setUsers] = useState(initialVal);

    const getUser = async (email, password) => {
        const requestBody = {email:email, password:password};
        const data = (await Axios.post(`http://localhost:8060/user/api/user/add`, requestBody).then((res)=>res.data));
        // await new Promise(resolve => setTimeout(resolve, 10000));
        console.log( 'get user data:', data);
        return data;
      }
    
    const postUser = async (newUser) => {
        const requestData = newUser;
        const data = (await Axios.post("http://localhost:8060/user/api/user",requestData).then((res)=>res.data));
        console.log( ' sent user data:', data);
    }

    const initializeUsers =()=>{
        setUsers(JSON.parse(localStorage.getItem('users')) || []);  
    }

    const saveToUsers = (updatedUsers,newUser) => {
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        console.log("save to users");
        console.log(users);
        console.log(localStorage.getItem("users"));
        postUser(newUser);
    };

    // Function to generate a random orderId
    const generateUserId = () => {
        return uuidv4();
    };

    const isEmailExists = (email) => {
        return users.some(user => user.email === email);
    };

    const addToUsers = (userName,email,address,password) => {
        if (isEmailExists(email)) {
            // Handle case where email already exists
            console.error("Email already exists. Please choose a different email.");
            return false;
        }
        const newUser = {
            id: generateUserId(),
            username: userName,
            email: email,
            address: address,
            password: password,
            };
        setUsers((prevUsers) => [...prevUsers, newUser]);
        saveToUsers([...users, newUser], newUser);
        return true;
    };

    const validateUser = async (email, password) => {
        const data = await getUser(email, password);
        console.log('user data for validation: ', data);
        const id = data?.id || null;
        console.log('validated id: ',id);
        //setUserId(id);
        //const user = users.find(user => user.email == email && user.password == password);
        return id; // Returns the matched user or null if not found
    };

    return {users, initializeUsers, addToUsers, saveToUsers, validateUser};
};

// const validateUser = async (email, password) => {
//     return new Promise((resolve, reject) => {
//       // Simulate an asynchronous operation, e.g., fetching user data from a server
//       setTimeout(() => {
//         const user = users.find(user => user.email === email && user.password === password);
//         resolve(user); // Resolving with the matched user or null if not found
//       }, 1000); // Simulating a delay of 1 second (adjust as needed)
//     });
//   };
  