"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/features/login/service";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/admin/login");
      router.refresh();
    },
  });

  return (
    <div className="flex items-center gap-3">
      {logoutMutation.isError && (
        <span role="alert" className="text-sm text-[#a43f35]">ออกจากระบบไม่สำเร็จ</span>
      )}
      <button
        type="button"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="text-sm font-bold text-[#52616c] hover:text-[#246b9c] disabled:cursor-wait disabled:opacity-65"
      >
        {logoutMutation.isPending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
      </button>
    </div>
  );
}
