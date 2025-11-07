import imgImage3 from "figma:asset/3e46155cb7e133a44b0cb66b10e663686402b8d8.png";
import imgImage4 from "figma:asset/d422c9dbb1d95c940f63b4c48d2844d79a234fa1.png";
import imgImage5 from "figma:asset/5aea67907099dfdc6f30a9cbaae05aee60732614.png";
import imgImage6 from "figma:asset/487efead8a6ede54dbe201e5670ea1c9e24f7ff3.png";
import imgImage7 from "figma:asset/a2ddd193f366b1ddc409a641de0e90a6cb0d57c0.png";

function Group() {
  return (
    <div className="absolute contents left-[157.5px] top-[129px]">
      <div className="absolute h-[1474px] left-[157.5px] top-[129px] w-[2827px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
      <div className="absolute h-[1516px] left-[157.5px] top-[1666px] w-[2827px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
      <div className="absolute h-[1387px] left-[157.5px] top-[2552px] w-[2827px]" data-name="image 5">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage5} />
      </div>
      <div className="absolute h-[1561px] left-[157.5px] top-[3896px] w-[2830px]" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage6} />
      </div>
      <div className="absolute h-[578px] left-[157.5px] top-[5539px] w-[2827px]" data-name="image 7">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[6237px] left-0 top-0 w-[3145px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3145 6237">
          <path d="M0 0H3145V6237H0V0Z" fill="var(--fill-0, white)" id="Rectangle 1" />
        </svg>
      </div>
      <Group />
    </div>
  );
}