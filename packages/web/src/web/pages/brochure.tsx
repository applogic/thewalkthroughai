import { Hero } from "../components/sections/hero";
import { Sectors, Transformations, Process, Portfolio, Questions } from "../components/sections/editorial";
import { Contact, Footer } from "../components/sections/contact";

export default function Brochure() {
  return <><Hero/><main><Sectors/><Transformations/><Process/><Portfolio/><Questions/><Contact/></main><Footer/></>;
}