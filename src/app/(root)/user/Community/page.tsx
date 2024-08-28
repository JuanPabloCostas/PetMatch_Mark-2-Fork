"use client";

import React, { useEffect, useState } from "react";
import CommunityCard from "@/Components/CommunityCard/CommunityCard";
import AddPost from "@/Components/AddPost/AddPost";
import { useUser } from "@clerk/nextjs";
import RightSidebar from "@/Components/RightSideBar/RightSideBar";
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/Components/Loading/Loading";
import { getUserStatus } from "@/libs/actions/user.actions";

export interface FormattedPost {
  id: string;
  fullname: string;
  username: string;
  text: string;
  avatar: string;
  timeDifference: string;
  image?: string;
  comments: number;
  likes: number;
  name?: string;
  liked: boolean;
}

const Community: React.FC = () => {
  const [posts, setPosts] = useState<FormattedPost[]>([]);
  const { user } = useUser();
  const [userId, setuserId] = useState<string | undefined>()
  const router = useRouter();
  const [isOpen, setisOpen] = useState(false);
  const [modalImage, setmodalImage] = useState<string | undefined>("");
  const [loading, setloading] = useState(false)

  const handleOpen = (imageUrl?: string) => {
    setmodalImage(imageUrl);
    setisOpen(true);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchComments = async () => {
    try {

      const email = user?.emailAddresses[0].emailAddress;

      let userStatus

      if (email) {
        userStatus = await getUserStatus(email);
      }



      const response = await fetch(`/api/comments?userId=${userStatus?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setuserId(userStatus?.id);

      console.log();
      


      const resBody = await response.json();

      if (!response.ok) {
        throw new Error(resBody.message || "Error fetching comments");
      }

      const commentsArray = resBody.data;

      if (Array.isArray(commentsArray)) {
        const formattedPosts: FormattedPost[] = commentsArray.map((comment: any) => {
          return {
            id: comment.id,
            fullname: comment.user?.fullname || "Anonymous",
            username: comment.user?.username || "anonymous",
            text: comment.text,
            avatar: comment.user?.photoUrl || user?.imageUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
            image: comment.imgUrl || "",
            timeDifference: comment.timeDifference || "Unknown",
            comments: comment.childrenComments?.length || 0,
            likes: comment.likes,
            name: comment.user?.fullname.split(' ')[0] + " " + (comment.user?.fullname.split(' ').length > 1 ? comment.user?.fullname.split(' ')[1] : ''),
            liked: comment.liked
          };
        });

        setPosts(formattedPosts);
        console.log('Comments fetched successfully:', formattedPosts);

      } else {
        console.error('Unexpected response format:', resBody);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [user?.imageUrl]);

  const handleFavorite = async (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );

    await fetch(`/api/comments/likes`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: id,
        userId: userId,
        isLike: true
      })
    })
  };

  const handleUnfavorite = async (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes - 1 } : post
      )
    );

    await fetch(`/api/comments/likes`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: id,
        userId: userId,
        isLike: false
      })
    })
  };

  const handleAddComment = (id: string) => {
    router.push(`/user/Community/${id}`);
  };

  const handleReply = (id: string) => {
    (`Responder al post ${id}`);
  };

  useEffect(() => {
    if (posts.length > 0) {
      setloading(false)
    }

    if (posts.length === 0) {
      setloading(true)
    }

  }, [posts])


  return (
    <>
      <Loading enabled={loading} fixed={true} />
      <div id="modal" className={`modal ${isOpen ? "is-active" : ""}`} onClick={() => setisOpen(false)}>
        <img src={modalImage} className="modal-content" alt="" onClick={(e) => e.stopPropagation()} />
      </div>
      <nav className="bg-white shadow-md z-50 flex justify-between items-center w-full fixed top-0 p-2">
        <div className="flex items-center gap-8">
          <Image
            src="/ZORRO_SIN1.webp"
            width={50}
            height={50}
            alt="Logo"
            className="xl:hidden -mt-6"
          />
          <h1 className="lg:text-4xl text-xl font-bold">Comunidad</h1>
        </div>
      </nav>
      <div className="flex flex-row mt-12 justify-between">
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="flex flex-col border-2 w-full lg:w-full">
            <AddPost onPostAdded={fetchComments} />
            <Divider />
            {posts.map((post, index) => {
              return (
                <div key={post.id}>
                  <CommunityCard
                    post={post}
                    userId={userId}
                    handleFavorite={handleFavorite}
                    handleUnfavorite={handleUnfavorite}
                    handleAddComment={() => handleAddComment(post.id)}
                    handleReply={() => handleReply(post.id)}
                    handleOpen={handleOpen}

                  />
                  {index < posts.length - 1 && <Divider />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-1/10">
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Community;
