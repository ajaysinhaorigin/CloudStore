const GET = async (req, res) => {
  console.log("profile---", req);
  return new Response(JSON.stringify({ name: "John Doe" }));
};

export { GET };
