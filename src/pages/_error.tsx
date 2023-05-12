import { Header, Layout } from "components";

export default function Error() {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header home="Gvatest" title={"500"} />
      <h1 style={{ textAlign: "center" }}>{`Something terrible happened...!`}</h1>
    </Layout>
  );
}
