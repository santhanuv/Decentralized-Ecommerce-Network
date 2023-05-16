import React, { useEffect } from "react";

const TestPage = () => {
  useEffect(() => {
    (async () => {})();
  }, []);

  return <div>TestPage</div>;
};

export default TestPage;
