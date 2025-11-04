"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, MapPin, Search } from "lucide-react";

interface ApartmentSelectDialogProps {
  selectedApartmentId: string;
  onSelect: (apartmentId: string) => void;
  error?: string;
}

export function ApartmentSelectDialog({
  selectedApartmentId,
  onSelect,
  error,
}: ApartmentSelectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apartments = [], isLoading } =
    trpc.auth.getApartments.useQuery();

  const filteredApartments = apartments.filter(
    (apt) =>
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedApartment = apartments.find(
    (apt) => apt.id === selectedApartmentId
  );

  const handleSelect = (apartmentId: string) => {
    onSelect(apartmentId);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div>
      <label
        className="text-sm font-medium text-gray-700 mb-2 flex items-center"
        htmlFor="apartmentName"
      >
        <Building2 className="w-4 h-4 mr-1" />
        거주 아파트 <span className="text-red-500 ml-1">*</span>
      </label>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            id="apartmentName"
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {selectedApartment ? (
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{selectedApartment.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">아파트를 검색해주세요</span>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>아파트 검색</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <label className="hidden sr-only" htmlFor="apartmentSearch">
                아파트 검색
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="apartmentSearch"
                placeholder="아파트명 또는 주소로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>아파트 목록을 불러오는 중...</p>
                </div>
              ) : filteredApartments.length > 0 ? (
                filteredApartments.map((apt) => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => handleSelect(apt.id)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <Building2 className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{apt.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {apt.address}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>검색 결과가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedApartment && (
        <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-start">
          <MapPin className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-primary-900">
              {selectedApartment.name}
            </p>
            <p className="text-primary-700">{selectedApartment.address}</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center">
          <span className="mr-1">✗</span> {error}
        </p>
      )}
    </div>
  );
}
