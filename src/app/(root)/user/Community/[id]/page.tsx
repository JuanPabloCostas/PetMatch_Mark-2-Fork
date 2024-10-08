'use client'
import AddPost from "@/Components/AddPost/AddPost";
import CommunityCard from "@/Components/CommunityCard/CommunityCard";
import { useUser } from "@clerk/nextjs";
import { Button, Divider, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchChildrenComments } from "@/libs/actions/comment.actions";
import { getUserStatus } from "@/libs/actions/user.actions";

// Define un tipo para los comentarios hijos
interface ChildComment {
  id: string;
  text: string;
  imgUrl: string;
  createdAt: string;
  user: {
    fullname: string;
    username: string;
    photoUrl: string;
  };
  timeDifference: string; 
}

// Define un tipo para los posts con los campos necesarios
interface FormattedPost {
  id: string;
  fullname: string;
  username: string;
  text: string;
  avatar: string;
  timeDifference: string; 
  image?: string; 
  comments: number;
  likes: number;
  childrenComments: ChildComment[];
  liked: boolean;
}

interface PageProps {
  params: {
    id: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [post, setPost] = useState<FormattedPost | null>(null);
  const { user } = useUser();
  const [userId, setuserId] = useState<string | undefined>()
  const router = useRouter();
  const [isOpen, setisOpen] = useState(false);
  const [modalImage, setmodalImage] = useState<string | undefined>("");

  const handleOpen = (imageUrl?: string) => {
    setmodalImage(imageUrl);
    setisOpen(true);
  };

  const loadComments = async () => {
    try {

      const email = user?.emailAddresses[0].emailAddress;

      let userStatus

      if (email) {
        userStatus = await getUserStatus(email);
      }

      setuserId(userStatus?.id);

      const result = await fetchChildrenComments(params.id, userStatus?.id);

      if (result) {
        const { id, text, imgUrl, user: commentUser, childrenComments, timeDifference, liked, likes } = result;
        const mainPost: FormattedPost = {
          id,
          fullname: commentUser?.fullname || "Anonymous",
          username: commentUser?.username || "anonymous",
          text: text,
          avatar: commentUser?.photoUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
          image: imgUrl || "",
          timeDifference: timeDifference || "Unknown", 
          comments: childrenComments.length || 0,
          likes: likes,
          childrenComments, // Incluye los comentarios hijos
          liked: liked || false,
        };

        setPost(mainPost);
      } else {
        console.error('Unexpected response format:', result);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [params.id, user?.imageUrl]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavorite = (id: string) => {
    // Función para manejar la adición a favoritos
  };

  const handleUnfavorite = (id: string) => {
    // Función para manejar la eliminación de favoritos
  };

  const handleAddComment = (id: string) => {
    router.push(`/user/Community/${id}`);
  };

  const handleReply = (id: string) => {
    (`Responder al post ${id}`);
  };

  const returnCommunity = () => {
    router.push('/user/Community');
  };

  return (
    <div className="flex flex-row gap-4">
      <div id="modal" className={`modal ${isOpen ? "is-active" : ""}`} onClick={() => setisOpen(false)}>
        <img src={modalImage} className="modal-content" alt="" />
      </div>
      <div className="flex flex-col w-full">
        <nav className="bg-white shadow-md z-50 flex justify-between items-center w-full fixed top-0 p-2">
          <div className="flex items-center gap-8">
            <h1 className="text-4xl font-bold cursor-pointer" onClick={returnCommunity}>Comunidad</h1>
          </div>
        </nav>
        <div className="flex flex-col w-full mt-16">
          {post && (
            <>
              <CommunityCard
                post={post}
                handleFavorite={handleFavorite}
                handleUnfavorite={handleUnfavorite}
                handleAddComment={() => handleAddComment(post.id)}
                handleReply={() => handleReply(post.id)}
                handleOpen={handleOpen} 
                userId={userId}
                />
              <Divider />
              <AddPost
                onPostAdded={loadComments}
                parentId={params.id} // Pasar el parentId al componente
              />
              <Divider />
              {post.childrenComments.length > 0 && (
                <div className="mt-4">
                  {post.childrenComments.map((comment: ChildComment) => (
                    <div key={comment.id} className="mb-4 p-4 border rounded-md">
                      <div className="flex items-center mb-2">
                        <img src={comment.user.photoUrl} alt={comment.user.fullname} className="w-10 h-10 rounded-full mr-2" />
                        <span className="font-bold">{comment.user.fullname}</span>
                        <span className="font-light text-sm ml-2">@{comment.user.username}</span>
                      </div>
                      <p>{comment.text}</p>
                      <p className="text-gray-500 text-sm">Hace {comment.timeDifference}</p> 
                      {comment.imgUrl && (
                        <div className="mt-4 mx-auto flex justify-center">
                          <Image
                            src={comment.imgUrl}
                            width={600}
                            height={300}
                            className="rounded-md justify-center"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
