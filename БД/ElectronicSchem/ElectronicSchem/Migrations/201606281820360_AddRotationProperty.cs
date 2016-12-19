namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRotationProperty : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ComponentModels", "Rotation", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ComponentModels", "Rotation");
        }
    }
}
