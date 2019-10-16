import React from "react"
import { graphql, useStaticQuery } from "gatsby"

const BlogArchive = () => {
  const postsResponse = useStaticQuery(graphql`
    query MyQuery {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              title
              date
              category
            }
            excerpt(pruneLength: 100)
          }
        }
      }
    }
  `)

  const postsData = postsResponse.allMarkdownRemark.edges.map(post => post.node)

  return (
    <div>
      <h1>Archive</h1>
      <ul>
        {postsData.map((post, index) => {
          return (
            <li key={index}>
              <h2>{post.frontmatter.title}</h2>
              <p>
                Published on {post.frontmatter.date} in{" "}
                {post.frontmatter.category}
              </p>
              <h4>{post.excerpt}</h4>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default BlogArchive
