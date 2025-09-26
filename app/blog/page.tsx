import { Heading } from "../../common/heading"
import { Section } from "../../common/section-wrapper"

import { BlogpostCard, blogpostCardFragment } from "./_components/blogpost-card"
import { PageView } from "../../components/page-view"
import type { Metadata } from "next"
import { basehub } from "basehub"

import "../../basehub.config"

export const dynamic = "force-static"
export const revalidate = 30

export const generateMetadata = async (): Promise<Metadata | undefined> => {
  try {
    const data = await basehub().query({
      site: {
        blog: {
          metadata: {
            title: true,
            description: true,
          },
        },
      },
    })

    return {
      title: data.site.blog.metadata.title ?? "Blog",
      description: data.site.blog.metadata.description ?? "Read our latest blog posts",
    }
  } catch (error) {
    console.error("Error fetching blog metadata:", error)
    // Return default metadata if BaseHub is not configured
    return {
      title: "Blog",
      description: "Read our latest blog posts",
    }
  }
}

export default async function BlogPage() {
  try {
    const {
      site: { blog, generalEvents },
    } = await basehub().query({
      site: {
        generalEvents: { ingestKey: true },
        blog: {
          _analyticsKey: true,
          mainTitle: true,
          featuredPosts: blogpostCardFragment,
          listTitle: true,
          posts: {
            __args: { orderBy: "publishedAt__DESC" },
            items: blogpostCardFragment,
          },
        },
      },
    })

    const { posts } = blog

    if (!posts || posts.items.length === 0) {
      return (
        <Section className="gap-16">
          <div className="grid grid-cols-1 gap-5 self-stretch md:grid-cols-2">
            <Heading align="left">
              <h2>{blog?.mainTitle || "Blog"}</h2>
            </Heading>
          </div>
          <div className="w-full space-y-3">
            <Heading align="left">
              <h3 className="!text-xl lg:!text-2xl">No posts available</h3>
            </Heading>
            <p className="text-[--text-secondary] dark:text-[--dark-text-secondary]">
              Check back later for new blog posts.
            </p>
          </div>
        </Section>
      )
    }

    return (
      <Section className="gap-16">
        <PageView ingestKey={generalEvents.ingestKey} />
        <div className="grid grid-cols-1 gap-5 self-stretch md:grid-cols-2">
          <Heading align="left">
            <h2>{blog.mainTitle}</h2>
          </Heading>
          {blog.featuredPosts?.slice(0, 3).map((post) => (
            <BlogpostCard key={post._id} type="card" {...post} />
          ))}
        </div>
        <div className="w-full space-y-3">
          <Heading align="left">
            <h3 className="!text-xl lg:!text-2xl">{blog.listTitle}</h3>
          </Heading>
          <div className="-mx-4 flex flex-col self-stretch">
            {posts.items.map((post) => (
              <BlogpostCard key={post._id} {...post} className="-mx-4" />
            ))}
          </div>
        </div>
      </Section>
    )
  } catch (error) {
    console.error("Error fetching blog data:", error)

    // Check if it's a BaseHub token issue
    const isTokenError = error instanceof Error && 
      (error.message.includes("Internal Server Error") || 
       error.message.includes("Request ID") ||
       error.message.includes("An unknown error occurred"))

    return (
      <Section className="gap-16">
        <div className="grid grid-cols-1 gap-5 self-stretch md:grid-cols-2">
          <Heading align="left">
            <h2>Blog</h2>
          </Heading>
        </div>
        <div className="w-full space-y-3">
          <Heading align="left">
            <h3 className="!text-xl lg:!text-2xl">
              {isTokenError ? "BaseHub Configuration Required" : "Unable to load blog posts"}
            </h3>
          </Heading>
          <div className="text-[--text-secondary] dark:text-[--dark-text-secondary] space-y-3">
            {isTokenError ? (
              <>
                <p>To use this blog, you need to configure your BaseHub token:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Create a <code className="bg-[--surface-secondary] dark:bg-[--dark-surface-secondary] px-2 py-1 rounded text-sm">.env.local</code> file in your project root</li>
                  <li>Add your BaseHub token: <code className="bg-[--surface-secondary] dark:bg-[--dark-surface-secondary] px-2 py-1 rounded text-sm">BASEHUB_TOKEN="your-token-here"</code></li>
                  <li>Get your token from your BaseHub repository Settings → API</li>
                  <li>Restart your development server</li>
                </ol>
                <p className="text-sm text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
                  For more details, see the README.md file.
                </p>
              </>
            ) : (
              <p>We're experiencing technical difficulties. Please try again later.</p>
            )}
          </div>
        </div>
      </Section>
    )
  }
}
