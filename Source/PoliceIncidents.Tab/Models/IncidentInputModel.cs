﻿// <copyright file="IncidentInputModel.cs" company="Engage Squared">
// Copyright (c) Engage Squared. All rights reserved.
// </copyright>

namespace PoliceIncidents.Tab.Models
{
    using System;
    using System.Collections.Generic;

    public class IncidentInputModel
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public string Location { get; set; }

        public Guid RegionId { get; set; }

        public Guid ManagerId { get; set; }

        public List<Guid> Members { get; set; }
    }
}