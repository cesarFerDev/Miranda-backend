import { validateUser } from "../../controllers/usersController";
import usersJSON from "../../data/users.json";
import { User } from "../../interfaces/interfaces";
import fs from "fs";

export const usersData = usersJSON;



const updateJSONFile = (usersList: User[]) => {
    fs.writeFileSync("./data/users.json", JSON.stringify(usersList, null, 2));
}

export const get = async() => {
    return usersData;
};

export const getSingleUser = async(id: string) => {
    const userObject = usersData.find(user => user.user_id === id) || null;
    return userObject;
};

export const post = async(userObject: User) => {
    userObject.user_id = (Math.floor((Math.random() * 100000))).toString();
    usersData.push(userObject);
    updateJSONFile(usersData);
    return userObject;
};

export const put = async(id: string, updateInfo: Partial<User>) => {
    if (updateInfo.user_id && updateInfo.user_id !== id) {
        throw new Error("User ID can't be changed");
    }

    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].user_id === id) {
            Object.assign(usersData[i], updateInfo);
            if (validateUser(usersData[i])) {
                updateJSONFile(usersData);
                return usersData[i];
            } else {
                throw new Error("Invalid data input");
            }
        }
    }
    return null;
};

export const delUser = async(id: string) => {
    const userToRemoveIndex = usersData.findIndex(user => user.user_id === id);

    if (userToRemoveIndex < 0) {
        throw new Error("Booking not found");
    }   

    usersData.splice(userToRemoveIndex, 1);
    updateJSONFile(usersData);
}