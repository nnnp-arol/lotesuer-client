import { trpc } from "../utils/trpc";
import SellerCard from "./SellerCard";

function SellerList() {
  const { data, isLoading, isError, error } = trpc.seller.get.useQuery();

  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Error: (error.message)</div>;

  return (
    <div className="flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        {data.map((seller: any) => (
          <SellerCard seller={seller} key={seller._id} />
        ))}
      </div>
    </div>
  );
}

export default SellerList;
