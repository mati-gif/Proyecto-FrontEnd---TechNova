import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../App.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="containerStyle">
      <div className="px-3">
        <p>¡Lo sentimos! La página solicitada no fue encontrada.</p>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate("/")}
          className="px-2 py-2 shadow-lg"
        >
          Volver
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
