import React, { useEffect, useState } from "react";

export default function SeatMonitor() {
  const [seats, setSeats] = useState([]);

  const mockHTML = `
    <div class="ikc-seat-code">J8</div>
    <mat-progress-bar aria-valuemax="100" aria-valuenow="53.88"></mat-progress-bar>
    <div class="ikc-seat-code">J9</div>
    <mat-progress-bar aria-valuemax="100" aria-valuenow="85.2"></mat-progress-bar>
    <div class="ikc-seat-code">J10</div>
    <mat-progress-bar aria-valuemax="100" aria-valuenow="100"></mat-progress-bar>
  `;

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(mockHTML, "text/html");
    const seatElements = doc.querySelectorAll(".ikc-seat-code");
    const progressBars = doc.querySelectorAll("mat-progress-bar");

    const parsedSeats = Array.from(seatElements).map((el, index) => {
      const seatNo = el.textContent.trim();
      const valueNow = parseFloat(progressBars[index].getAttribute("aria-valuenow"));
      const remainingPercent = 100 - valueNow;
      const maxMinutes = 180;
      const remainingMinutes = Math.floor((remainingPercent / 100) * maxMinutes);
      const status = valueNow < 100 ? "사용 중" : "사용 가능";

      return {
        seatNo,
        remainingMinutes,
        status,
      };
    });

    parsedSeats.sort((a, b) => a.remainingMinutes - b.remainingMinutes);
    setSeats(parsedSeats);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">건국대 3열람실 좌석 상태</h1>
      <div className="grid grid-cols-1 gap-2">
        {seats.map((seat, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 shadow flex justify-between items-center"
          >
            <div>
              <div className="text-lg font-semibold">좌석: {seat.seatNo}</div>
              <div className="text-sm text-gray-600">
                남은 시간: {seat.remainingMinutes}분
              </div>
              <div className={`text-sm ${seat.status === "사용 가능" ? "text-green-600" : "text-red-600"}`}>
                상태: {seat.status}
              </div>
            </div>
            {seat.status === "사용 가능" ? (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
                바로 배정
              </button>
            ) : (
              <button className="bg-gray-300 text-white px-4 py-2 rounded-xl cursor-not-allowed" disabled>
                사용 중
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}