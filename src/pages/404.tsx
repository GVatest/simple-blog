import { Header, Layout } from "components";

export default function Error404 () {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header title={"404"} home="Gvatest" />
      <h1 style={{ textAlign: "center" }}>{`Not Found =(`}</h1>
    </Layout>
  );
}
