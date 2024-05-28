import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Social } from "@/Components/auth/Social";
import { Switch } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginForm() {

  
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { name: "", password: "" },
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/admin/${name}`);
      const data = await response.json();
      const result = await signIn("credentials", {
        redirect: false,
        name: name,
        password: password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        const user = result as { user?: { isAdmin: boolean } };
        if (isAdmin && data.isAdmin) {
          router.push("/dashboardAdmin");
        } else if (!isAdmin && !user.user?.isAdmin) {
          router.push("/user/PrincipalPage");
        } else {
          setError("No tienes los privilegios");
        }
      }
    } catch (error) {
      setError("Hubo un error al iniciar sesión.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] h-full flex flex-col justify-evenly">
        {error && <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">{error}</p>}
        <Input
          label="Nombre"
          labelPlacement="outside"
          placeholder="Emiliano Obregon"
          {...register("name")}
          value={name}
          onValueChange={setName}

          isRequired
        />
        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        <Input
          type="password"
          label="Contraseña"
          labelPlacement="outside"
          placeholder="********"
          {...register("password")}
          value={password}
          onValueChange={setPassword  }
          isRequired
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        <div className="mt-2 mb-2">
          <Switch
            color="danger"
            className="text-success-300"
            isSelected={isAdmin} 
            onValueChange={setIsAdmin}
          >
            ¿Eres administrador?
          </Switch>
        </div>
        <Button color="success" className="w-full bg-success-300 font-bold" type="submit">
          Iniciar Sesión
        </Button>
        <div>
          <Social />
        </div>
      </form>
    </>
  );
}