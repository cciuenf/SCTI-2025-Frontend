"use client"

import { ProductResponseI } from "@/types/product-interfaces";
import { ActivityResponseI } from "@/types/activity-interface";
import ActivityHandle from "./ActivityHandle";
// import ProductHandle from "./ProductHandle";

interface ProductsListI {
  activities: ActivityResponseI[];
  currentEvent: { id: string; slug: string }
  onActivityUpdate: (updatedActivity: ActivityResponseI) => Promise<void>;
  onActivityDelete: (activityId: string) => Promise<void>;
}

export default function ActivitiesList({ activities, currentEvent, onActivityUpdate, onActivityDelete }: ProductsListI) {
  return (
    <>
      {activities.map((activity) => (
        <div key={activity.ID} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
          <div className="space-y-2 text-gray-600">
          <p><span className="font-semibold">Speaker:</span> {activity.speaker}</p>
            <p><span className="font-semibold">Slug Independente:</span> {activity.is_standalone ? activity.standalone_slug : 'Não Possui'}</p>
            <p><span className="font-semibold">Capacidade:</span> {activity.has_unlimited_capacity ? "Infinito" : activity.max_capacity}</p>
            <p><span className="font-semibold">Localização:</span> {activity.location}</p>
            <p><span className="font-semibold">Descrição:</span> {activity.description}</p>
            <p><span className="font-semibold">Tem Taxa</span> {activity.has_fee ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Bloqueado:</span> {activity.is_blocked ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Oculto:</span> {activity.is_hidden ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Obrigatório:</span> {activity.is_mandatory ? 'Sim' : 'Não'}</p>
            <p className="text-gray-600">
              <span className="font-semibold">Data de Inicio:</span>{' '}
              {new Date(activity.start_time).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Data de Encerramento:</span>{' '}
              {new Date(activity.end_time).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <ActivityHandle
            activity={activity}
            currentEvent={currentEvent}
            onActivityUpdate={onActivityUpdate}
            onActivityDelete={onActivityDelete}
          />
        </div>
      ))}
    </>
  );
}
