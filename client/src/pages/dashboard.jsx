import { useAuth } from "@/contexts/AuthContext";
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
