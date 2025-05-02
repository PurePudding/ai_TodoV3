import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import useUserStore from "../../stores/userStore";
import useAssistantStore from "../../stores/assistantStore";

interface UserFormProps {
  onStartCall: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onStartCall }) => {
  const { setUser } = useUserStore();
  const { startVoiceAssistant, isLoading } = useAssistantStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setUser(formData);
      await startVoiceAssistant(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone
      );
      onStartCall();
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Contact Information
        </h2>
        <p className="text-gray-600 mt-1">
          Please provide your details to start the voice assistant
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="firstName"
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            icon={<User size={16} />}
            required
          />

          <Input
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            icon={<User size={16} />}
            fullWidth
            required
          />
        </div>

        <Input
          name="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={16} />}
          fullWidth
          required
        />

        <Input
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="+1 (123) 456-7890"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={<Phone size={16} />}
          fullWidth
          required
        />

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Voice Assistant"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserForm;
