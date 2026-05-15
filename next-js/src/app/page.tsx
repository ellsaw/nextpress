import WPGetHomepage from "@/lib/wordpress/functions/WPGetHomepage";

export default async function Home() {
  const post = await WPGetHomepage(); 
  if (!post) return;

  return (
    <>
      <h1>{ post.post_title }</h1>
    </>
  )
}
