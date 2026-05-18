import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback} from "../components/ui/avatar";
import { Search } from 'lucide-react';
import { chatApi } from '../api/chatApi';

interface User {
  ma_nguoi_dung: string;
  ten: string;
  ten_dang_nhap: string;
  email: string;
  ma_ngon_ngu: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewConversationDialog({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch danh sách user khi dialog mở
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await chatApi.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Lỗi lấy danh sách user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [open]);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.ten?.toLowerCase().includes(q) ||
      u.ten_dang_nhap?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const handleSelectUser = async (user: User) => {
    try {
      setIsCreating(true);
      const newConv = await chatApi.createConversation(user.ma_nguoi_dung);
      onClose();
      // Chuyển thẳng vào phòng chat vừa tạo
      navigate(`/app/chat/${newConv.ma_cuoc_hoi_thoai}`);
    } catch (err) {
      console.error('Lỗi tạo cuộc hội thoại:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo cuộc hội thoại mới</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Danh sách user */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500 py-6">Đang tải...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-6">
              Không tìm thấy người dùng
            </p>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.ma_nguoi_dung}
                onClick={() => handleSelectUser(user)}
                disabled={isCreating}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <Avatar>
                  <AvatarFallback>
                    {(user.ten || user.ten_dang_nhap || '?').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {user.ten || user.ten_dang_nhap}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">
                  {user.ma_ngon_ngu === 'ja' ? '🇯🇵' : '🇻🇳'}
                </span>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}