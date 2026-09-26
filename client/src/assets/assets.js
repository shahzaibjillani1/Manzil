import logo from './logo.svg'
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import roomImg1 from './roomImg1.png'
import roomImg2 from './roomImg2.png'
import roomImg3 from './roomImg3.png'
import roomImg4 from './roomImg4.png'
import regImage from './regImage.png'
import exclusiveOfferCardImg1 from "./exclusiveOfferCardImg1.png";
import exclusiveOfferCardImg2 from "./exclusiveOfferCardImg2.png";
import exclusiveOfferCardImg3 from "./exclusiveOfferCardImg3.png";
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";


export const assets = {
    logo,
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
}

export const cities = [
    "Islamabad",
    "Lahore",
    "Karachi",
    "Murree",
    "Swat",
    "Hunza",
];

// Seasonal Curated Packages
export const exclusiveOffers = [
    { _id: 1, title: "Northern Escapes & Valleys", description: "Complimentary breakfast, guided mountain trekking, and scenic sunset tea in Hunza & Swat.", priceOff: 25, expiryDate: "Summer Peak Season", image: exclusiveOfferCardImg1 },
    { _id: 2, title: "Mughal Heritage Experience", description: "Luxury suites in Lahore with authentic heritage tours and complimentary Desi breakfast.", priceOff: 20, expiryDate: "Cultural Weekend Pass", image: exclusiveOfferCardImg2 },
    { _id: 3, title: "Margalla Hills Executive Stay", description: "Privileged corporate and family rates for diplomatic enclave and Islamabad hill suites.", priceOff: 30, expiryDate: "Advance Booking Privilege", image: exclusiveOfferCardImg3 },
];

// Testimonials Data
export const testimonials = [
    { id: 1, name: "Zainab Malik", address: "Lahore, Pakistan", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200", rating: 5, review: "Manzil transformed our family vacation in Hunza. The personalized Pakistani hospitality and stunning views of Rakaposhi were unforgettable!" },
    { id: 2, name: "Bilal Ahmed", address: "Islamabad, Pakistan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", rating: 5, review: "Manzil exceeded all expectations. Seamless booking, instant confirmation, and the Murree heritage lodge was spotless and cozy. Bohat zabardast service!" },
    { id: 3, name: "Dr. Ayesha Siddiqui", address: "Karachi, Pakistan", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200", rating: 5, review: "Finding genuine luxury stays across Pakistan used to be challenging. Manzil has set a new gold standard for hospitality in Pakistan!" }
];

// Facility Icon
export const facilityIcons = {
    "Free WiFi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
};

// For Room Details Page
export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Hospitality", description: "This host follows Manzil's strict quality & cleanliness standards." },
    { icon: assets.locationFilledIcon, title: "Prime Location", description: "95% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Warm Pakistani Welcome", description: "100% of guests experienced seamless check-in and gracious host service." },
];



// --------- SVG code for Book Icon------
/* 
const BookIcon = ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

*/