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
