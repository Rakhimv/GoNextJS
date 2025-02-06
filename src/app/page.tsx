"use client"


import { DeleteOutline } from "@mui/icons-material";
import { Breadcrumbs, Button, Card, IconButton, Input } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}



export default function Home() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [load, setLoad] = useState<boolean>(false)
  const [users, setUsers] = useState<User[] | null>(null)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true)
    if (email.trim() && name.trim()) {
      try {
        const req = await axios.post("https://azjson.tech:6060/users", {
          "name": name,
          "email": email,
        });
        if (req.status === 200) {
          getUsers()
        }
      } catch (err) {
        console.error("Ошибка при отправке:", err);
      }
    } else {
      alert("Заполните все поля!");
    }
    setLoad(false)
  };


  const getUsers = async () => {
    try {
      const req = await axios.get("https://azjson.tech:6060/users");
      if (req.status === 200) {
        setUsers(req.data);
      }
    } catch {
      console.error("Ошибка при получении списка пользователей");
    }
  }


  const deleteUser = async (id: number) => {
    try {
      const req = await axios.delete(`https://azjson.tech:6060/users/${id}`);
      if (req.status === 200) {
        getUsers()
      }
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
    }
  }




  useEffect(() => {
    getUsers()
  }, [])




  return (
    <div className="flex items-center justify-center flex-col py-[50px] px-[20px] w-full min-h-screen">
      <form onSubmit={handleSubmit} className="flex max-w-[300px] w-full flex-col items-center gap-[20px]">
        <Input fullWidth value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" />
        <Input fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
        <Button loading={load} type="submit" variant="contained" fullWidth>GO</Button>
      </form>


      <div className="w-full max-w-[300px] mt-[50px] flex flex-col">

        <Breadcrumbs aria-label="breadcrumb">
          <p>
            Home
          </p>

          <p>
            Users
          </p>

        </Breadcrumbs>



        <div className="w-full mt-[20px] flex flex-col gap-[20px]">
          {users && users.map((user: User, key: number) =>
              <Card key={key} className="w-ful p-[20px] flex items-center justify-between gap-[20px]">
                <p className="w-full max-w-[50%]">
                  {user.id} | {user.name} | {user.email}
                </p>


                <IconButton color="error" onClick={()=>deleteUser(user.id)}>
                  <DeleteOutline />
                </IconButton>
              </Card>
          )}
        </div>

      </div>
    </div>
  );
}
