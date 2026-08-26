<?php

namespace Tests\Unit;

use App\Models\TicketPriority;
use App\Services\TicketSlaService;
use Carbon\Carbon;
use Tests\TestCase;

class TicketSlaServiceTest extends TestCase
{
    public function test_baja_priority_gets_forty_eight_hour_sla(): void
    {
        Carbon::setTestNow(
            Carbon::create(2026, 8, 26, 10, 0, 0)
        );

        $priority = new TicketPriority([
            'name' => 'Baja',
            'sla_minutes' => 2880,
        ]);

        $service = new TicketSlaService();

        $dueAt = $service->calculateDueAt($priority);

        $this->assertEquals(
            '2026-08-28 10:00:00',
            $dueAt->format('Y-m-d H:i:s')
        );

        Carbon::setTestNow();
    }

    public function test_media_priority_gets_twenty_four_hour_sla(): void
    {
        Carbon::setTestNow(
            Carbon::create(2026, 8, 26, 10, 0, 0)
        );

        $priority = new TicketPriority([
            'name' => 'Media',
            'sla_minutes' => 1440,
        ]);

        $service = new TicketSlaService();

        $dueAt = $service->calculateDueAt($priority);

        $this->assertEquals(
            '2026-08-27 10:00:00',
            $dueAt->format('Y-m-d H:i:s')
        );

        Carbon::setTestNow();
    }

    public function test_alta_priority_gets_eight_hour_sla(): void
    {
        Carbon::setTestNow(
            Carbon::create(2026, 8, 26, 10, 0, 0)
        );

        $priority = new TicketPriority([
            'name' => 'Alta',
            'sla_minutes' => 480,
        ]);

        $service = new TicketSlaService();

        $dueAt = $service->calculateDueAt($priority);

        $this->assertEquals(
            '2026-08-26 18:00:00',
            $dueAt->format('Y-m-d H:i:s')
        );

        Carbon::setTestNow();
    }

    public function test_urgente_priority_gets_two_hour_sla(): void
    {
        Carbon::setTestNow(
            Carbon::create(2026, 8, 26, 10, 0, 0)
        );

        $priority = new TicketPriority([
            'name' => 'Urgente',
            'sla_minutes' => 120,
        ]);

        $service = new TicketSlaService();

        $dueAt = $service->calculateDueAt($priority);

        $this->assertEquals(
            '2026-08-26 12:00:00',
            $dueAt->format('Y-m-d H:i:s')
        );

        Carbon::setTestNow();
    }
}