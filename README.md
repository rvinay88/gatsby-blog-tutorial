# How to build a blog using Gatsby JS and markdown

### Introdction

Gatsby is a static site builder that abstracts away the complexity of fetching data. It provides a common graphQL API for querying data, irrespective of where that data is stored – a headless CMS, wordpress, filesystem, CSV, JSON or YAML. The goal of this article is to use Gatsby for blogging using markdown files and YAML meta data. We will cover the following topics:

- Use React and GraphQL for the UI and querying data
- Use markdown for writing articles
- Configure Gatsby to parse markdown and YAML and generate HTML and meta data
- Create post archive, post detail pages

## Prerequisites

This article assumes you have Node JS v12.12 or later installed. The code is written on mac OS but should be similar for other operating systems. You can find the git repository [here](https://github.com/rvinay88/gatsby-blog-tutorial)

## Step 1 — Install Gatsby And Start A New Project

Let's begin by installing the Gatsby CLI globally. This allows you to create new gatsby projects easily.

```js
[label] Terminal
npm install -g gatsby-cli
```

Once it has been installed, create a new project using the following command:

```js
[label] Terminal
gatsby new blog
```

![image of terminal installing gatsby](./src/article-images/1-create-gatsby-project.png?raw=true)

Now `cd` into the project folder and run `gatsby develop` command.

```js
[label] Terminal
cd blog
gatsby develop
```

If everything goes well, you should have something that looks like the following screenshot in your terminal.

![image of terminal running gatsby develop](./src/article-images/2-run-gatsby-develop.png?raw=true)

You should also be able to:

- Access the UI at http://localhost:8000
- Access the GraphQL playground at http://localhost:8000/___graphql

![image of gatsby homepage](./src/article-images/3-gatsby-home-page.png?raw=true)

![image of graphql playground](./src/article-images/4-graphiql-playground.png?raw=true)

## Step 2 - Create Some Blog Posts

For our purposes, let's create a blog folder inside the `src` directroy. This folder will contain all our blogposts in markdown format. Go ahead and add some sample markdown posts. Let's also add some content in the markdown post using the following format.

![image of blog post data](./src/article-images/5-create-blog-posts?raw=true)

The initial section in between the two `---` is used to add meta-data for any post such as date of publishing, category, slug for URL and title. The rest of the post is the actual blog content.

Note: Make sure the date value is surrounded by quotes so it's inferred as a string when querying. This will come in handy when using Gatsby's inbuilt date parsing functionality later.

## Step 3 - Configuring The Filesystem Plugin

In order for Gatsby to query the blog folder, we need to tell Gatsby to use the `gatsby-source-filesystem` to look for blog posts in the `src/blog` folder and query them. Open gatsby-config.js and add the following snippet to the plugins array.

```js
[label gatsby-config.js]
{
  resolve: `gatsby-source-filesystem`,
  options: {
    name: `blogPosts`,
    path: `${__dirname}/src/blog`,
  },
},
```

Since our files are in markdown format, we also need to install the `gatsby-transformer-remark` plugin and configure in. Run the following command to install this plugin.

```js
[label] Terminal
npm install --save gatsby-transformer-remark
```

Once it has successfully been installed, open gatsby-config.js and add the following snippet to the plugins array.

```js
[label gatsby-config.js]
{
  resolve: `gatsby-transformer-remark`
}
```

Now restart your `gatsby-develop` session, so it loads the new configuration. Once the server is up, go to the graphQL playground at http://localhost:8000/___graphql

You should be able to see `allMarkdownRemark` in the left hand side column.

## Using The GraphQL Playground

The GraphQL playground lets you query all markdown posts and specify which fields you are expecting. The following query gives us what we need for the archive page – mainly the title, date, category, slug and a preview of the post content truncated at a 100 characters.

```js
[label graphiQL playground]
query MyQuery {
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          title
          date
          category
          slug
        }
        excerpt(pruneLength:100)
      }
    }
  }
}
```

![image of playground with blog query](./src/article-images/7-query-posts.png?raw=true)

## Create An Archive Component

In components, create a new file called `blogArchive.js`. First let's fill it with a basic React component that returns a heading.

```js
[label ./src/components/blogArchive.js]
import React from 'react'

const BlogArchive = () => {
  return (
    <div>
      <h1>Archive</h1>
    </div>
  )
}

export default BlogArchive
```

Now, we need to provide this component with data from our graphQL query, that we tested earlier. Gatsby comes with a hook called `useStaticQuery` for this purpose. We will also need a special tagged template literal function called `graphql` to pass the query we need for this component. Add the below line to the top of the component file:

```js
[label ./src/components/blogArchive.js]
import { graphql, useStaticQuery } from 'gatsby';
```

Now within the same file, we can use this hook to fetch the data.

```js
[label ./src/components/blogArchive.js]
const postsResponse = useStaticQuery(graphql`
  query MyQuery {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            date
            category
            slug
          }
          excerpt(pruneLength: 100)
        }
      }
    }
  }
`)
```

When the query executes, postResponse will have the following data structure:

```js
[label graphiQL playground]
{
  "allMarkdownRemark": {
      "edges": [
        {
          "node": {
            "frontmatter": {
              "title": "My first blog post",
              "date": "10-16-2019",
              "category": [
                "articles"
              ],
              "slug": "blog-post-1"
            },
            "excerpt": "My first blog post Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis justo eu…"
          }
        },
        {
          "node": {
            "frontmatter": {
              "title": "My second blog post",
              "date": "10-16-2019",
              "category": [
                "articles",
                "tutorials"
              ],
              "slug": "blog-post-2"
            },
            "excerpt": "My second blog post Cras libero lectus, ullamcorper nec pellentesque ut, convallis vel turpis…"
          }
        }
      ]
    }
}
```

Let's extract the post information from this by mapping through the response.

```js
[label ./src/components/blogArchive.js]
const postsData = postsResponse.allMarkdownRemark.edges.map(post => post.node)
```

Now we have an array of post objects with frontmatter and excerpt data like below:

```js
[label graphiQL playground]
[
  {
    frontmatter: {
      title: "My first blog post",
      date: "10-16-2019",
      category: ["articles"],
      slug: "blog-post-1",
    },
    excerpt:
      "My first blog post Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis justo eu…",
  },
  {
    frontmatter: {
      title: "My second blog post",
      date: "10-16-2019",
      category: ["articles", "tutorials"],
      slug: "blog-post-2",
    },
    excerpt:
      "My second blog post Cras libero lectus, ullamcorper nec pellentesque ut, convallis vel turpis…",
  },
]
```

Let's iterate through this array in the render method of the blog archive component.

```js
[label ./src/components/blogArchive.js]
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
```

The entirety of the BlogArchive component is below.

```js
[label ./src/components/blogArchive.js]
import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"

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
              slug
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
              <Link to={`/blog/${post.frontmatter.slug}`}>
                <h2>{post.frontmatter.title}</h2>
              </Link>
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

```

For demo purposes, we will make the archive the only thing that shows up on the homepage. Let's edit `index.js` as below to render the `<BlogArchive />` component.

```js
[label ./src/pages/index.js]
import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogArchive from "../components/blogArchive"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <BlogArchive />
  </Layout>
)

export default IndexPage
```

Now the homepage should look like the below screenshot.

![image of homepage with blog posts](./src/article-images/9-view-posts.png?raw=true)

Clicking on the links will not work at this point because we haven't created a post template. Let's fix that.

## Creating The Post template

In order for the blog post component to work, we need to treat it as a template that will get hydrated with content from each markdown file.

Let's create a `templates` folder and create a `blogPost.js` file. The file is essentially a react component, that expects a data property and displays the properties of post as follows. We still haven't implemented the data part yet but this will help.

```js
[label ./src/templates/blogPost.js]
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <div>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  )
}
```

Note: `dangerouslySetInnerHTML` is required to render the parsed output.

Gatsby allows you to export a query function in a component that populates the data property for the same component. So adding the following to the same file is the equivalent of running this query and passing the result as the data property to the component.

```js
export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
```

In this query, we are filtering all markdown files, based on the slug property. The slug property is provided as a query variable. Gatsby takes care of supplying the variable during build time for each blog post. But if we want to test this in the playground, we can add this query and supply the variable in the bottom panel to see the result.

![image of graphiql with blogpost1 variable](./src/article-images/10-query-with-slug.png?raw=true)

Next open `gatsby-node.js` file and add the following snippet to tell Gatsby to add a slug parameter to each node. This snippet runs everytime the build process creates a node (once for each page, post, image etc). We only care about the blog posts, so we are filtering by `node.internal.type`. Then we are fetching the `slug` property and appending it to the node itself.

```js
[label ./gatsby-node.js]
const path = require(`path`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = node.frontmatter.slug
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
```

Next we need to tell Gatsby to create a page for each blog post and use the slug property we just added. In the same file, add the following snippet:

```js
[label ./gatsby-node.js]
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `/blog/${node.fields.slug}`,
      component: path.resolve(`./src/templates/blogPost.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}
```

The `createPages` function queries all markdown files and creates a page for every one of them. It uses the `blogPost.js` file as a template and generates the URL from the slug field. Now restart the `gatsby-develop` command. You should be able to click into each post and see the post's content now.

![image of blog post content](./src/article-images/11-view-post.png?raw=true)

## Conclusion

In this article, we saw how to install plugins to Gatsby and query the file system. We tinkered with queries in the graphQL playground and created react components that worked with these queries on the UI. We built a blog archive page and a blog post page.
