import React from "react";
import { useNavigate } from "react-router-dom";
import { addPost } from "../api-helpers/helpers";
import DiaryForm from "./DiaryForm";

const Add = () => {
  const navigate = useNavigate();

  const handleSubmit = async (inputs) => {
    await addPost(inputs);
    navigate("/diaries");
  };

  return (
    <DiaryForm
      heading="Add Your Travel Diary"
      submitLabel="Post"
      onSubmit={handleSubmit}
    />
  );
};

export default Add;
