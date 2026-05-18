import wpGetHomepage from "@/lib/wordpress/functions/wpGetHomepage";

export default async function Home() {
  const post = await wpGetHomepage(); 
  if (!post) return;

  return (
    <>
      <h1>{ post.postTitle }</h1>
    </>
  )
}
