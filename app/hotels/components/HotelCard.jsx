import Link from "next/link";

const HotelCard = ({ hotelData }) => {
  return (
    <Link href={`/hotels/${hotelData.hotelId}`}>
      <div>{hotelData.name}</div>
    </Link>
  );
};

export default HotelCard;
