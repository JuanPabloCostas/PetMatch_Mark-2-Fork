'use client'

import { Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import PostCard from "@/Components/PostCard/PostCard";
import { PostCardProps } from "@/Components/PostCard/PostCard";
import { getSizeLabel } from "@/data/sizeAnimals";
import { getAgeLabel } from "@/data/ageAnimals";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function VetPost() {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts/getPropios/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Posts Data:", data.data);
        console.log("Current User ID:", user.id);

        data.data.forEach((post: any, index: number) => {
          console.log(`Post ${index}:`, post);
        });

        const userPosts = data.data.filter((post: any) => {
          return post.user && post.user.id === user.id;
        });

        console.log("User Posts:", userPosts);

        const formattedPosts = userPosts.map((post: any, index: number) => {
          const formattedPost = {
            id: index,
            urlImage: post.urlImage,
            avatar: post.user.photoUrl,
            fullname: post.user.fullname,
            username: post.user.username,
            content: post.description,
            race: post.animal.breed,
            size: getSizeLabel(post.animal.size),
            age: getAgeLabel(post.animal.age),
            instagram: "",
            whatsapp: "",
            facebook: ""
          };
          return formattedPost;
        });

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col w-full h-full gap-8">
      <header className="flex justify-between items-center">
        <h1 className="lg:text-4xl text-xl font-bold">Mis Publicaciones</h1>
        <div className="flex gap-4">
          <Button isIconOnly className="bg-transparent">
            <span className="material-symbols-outlined">notifications</span>
          </Button>
          <Button isIconOnly className="bg-transparent">
            <span className="material-symbols-outlined">mail</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={index}
                id={post.id}
                urlImage={post.urlImage}
                avatar={post.avatar}
                fullname={post.fullname}
                username={post.username}
                content={post.content}
                race={post.race}
                size={post.size}
                age={post.age}
                instagram={post.instagram}
                whatsapp={post.whatsapp}
                facebook={post.facebook}
              />
            ))
          ) : (
            <p>No hay publicaciones.</p> // Mensaje en caso de que no haya publicaciones
          )}
        </div>
      </div>
    </div>
  );

}
