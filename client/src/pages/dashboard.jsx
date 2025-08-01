import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Rss, User } from "lucide-react";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import API from "@/lib/axios";
import AdminDashboard from "@/components/AdminDashboard";
import UserDashboard from "@/components/UserDashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
      <>
        {user?.role && user.role ==="admin"?<AdminDashboard/>:<UserDashboard/>}
        </>
        );
}
