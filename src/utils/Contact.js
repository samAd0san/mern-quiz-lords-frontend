import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle, FaCommentAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Contact() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFeedback, setIsFeedback] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if the user came from the profile page
    if (location.state && location.state.from === "profile") {
      setIsFeedback(true);
    }
  }, [location]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "3d3a52d5-312e-4087-9e11-0b88cacdec94");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setIsSubmitting(false);

    if (data.success) {
      setIsSubmitted(true);
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setIsSubmitted(false);
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-4xl font-semibold text-center text-primary">
          {isFeedback ? "Share Your Feedback" : "Contact Us"}
        </h2>
        <p className="mb-8 text-center text-gray-500 sm:text-xl lg:mb-16">
          {isFeedback 
            ? "We value your opinion! Help us improve your learning experience by sharing your feedback about the quiz platform."
            : "Got a technical issue? Want to send feedback about a beta feature? Or want us to call you back? Let us know."}
        </p>

        {isFeedback && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <FaCommentAlt className="text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-blue-800">Your Feedback Matters</h3>
            </div>
            <p className="text-gray-700">
              Your insights help us create better quizzes and enhance the platform for all students. 
              Please let us know what you liked, what could be improved, and any suggestions you have.
            </p>
          </div>
        )}

        {isSubmitting && (
          <div className="flex flex-col items-center justify-center h-full">
            <FaSpinner className="animate-spin text-6xl text-primary" />
            <p className="mt-4 text-xl">Submitting...</p>
          </div>
        )}

        {isSubmitted && (
          <div className="flex flex-col items-center justify-center h-full">
            <FaCheckCircle className="text-6xl text-green-500" />
            <p className="mt-4 text-xl">{result}</p>
          </div>
        )}

        {!isSubmitting && !isSubmitted && (
          <form onSubmit={onSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-black text-xl font-medium"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder="name@gmail.com"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-xl font-medium text-black"
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                required
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm"
                placeholder={isFeedback ? "Feedback about the quiz platform" : "Let us know how we can help you"}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-xl font-medium text-black"
              >
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
                placeholder={isFeedback ? "Share your feedback about the quiz platform..." : "Leave a comment..."}
              ></textarea>
            </div>
            <button
              type="submit"
              className="rounded-lg px-5 py-3 text-center text-sm text-white bg-primary transition-all duration-300
              hover:bg-secondary sm:w-fit"
            >
              {isFeedback ? "Submit Feedback" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Contact;