// import { Icon } from "./Icon";
// import { IconComponentNode } from "./IconComponentNode";

function SiteAlert(){
    return(
        <div className="site-alert">
          {/* <Icon className="icon-instance" /> */}
          <div className="frame-5">
            <p className="emergency-alert">You are short of Attendance!</p>
            <p className="additional-context">
              In case of discrepancy, contact your instructor.
            </p>
          </div>
        </div>
    )
};

export default SiteAlert