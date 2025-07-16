import homeBaner from "../../assets/491.jpg";
import { LuNotebookPen } from "react-icons/lu";

export default function About() {
    return (
        <>
            <img src={homeBaner} alt={homeBaner} className="img-fluid home_baner" />
            <div className="container">
                <div className="card_container">

                    <div className="card">
                        <LuNotebookPen />
                        <h5>Request for a Free Trail</h5>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </div>

                    <div className="card">
                        <LuNotebookPen />
                        <h5>Request for a Free Trail</h5>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </div>

                    <div className="card">
                        <LuNotebookPen />
                        <h5>Request for a Free Trail</h5>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </div>

                </div>
            </div>
        </>
    )
}